import { baseApiSlice } from "@/feature/slice/baseApi";
import {
  dismissUpload,
  setError,
  setStage,
  setSuccess,
  startUpload,
  updateProgress,
} from "@/feature/slice/postUpload/postUploadSlice";
import { store } from "@/feature/store";
import { getToken } from "@/lib/token";
import toast from "react-hot-toast";

export interface BackgroundUploadConfig {
  url: string; // e.g. "/posts" or "/industry/post/create"
  formData: FormData;
  fileName?: string;
  fileSize?: string;
  isVideo?: boolean;
  postExcerpt?: string;
  totalBytes?: number;
}

let activeXhr: XMLHttpRequest | null = null;
let lastConfig: BackgroundUploadConfig | null = null;
let dismissTimer: NodeJS.Timeout | null = null;

export async function startBackgroundPostUpload(config: BackgroundUploadConfig) {
  lastConfig = config;

  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }

  // Cancel any existing active upload
  if (activeXhr) {
    try {
      activeXhr.abort();
    } catch {}
    activeXhr = null;
  }

  // Calculate approximate total size if not provided
  let calculatedSize = config.totalBytes || 0;
  if (!calculatedSize) {
    config.formData.forEach((value) => {
      if (value instanceof File) {
        calculatedSize += value.size;
      }
    });
  }

  // 1. Dispatch initial state to Redux
  store.dispatch(
    startUpload({
      fileName: config.fileName,
      fileSize: config.fileSize,
      isVideo: config.isVideo,
      postExcerpt: config.postExcerpt,
      totalBytes: calculatedSize,
    }),
  );

  const token = await getToken();
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://vini.softvenceomegaforce.cloud/api";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const endpoint = config.url.startsWith("/") ? config.url : `/${config.url}`;
  const fullUrl = config.url.startsWith("http") ? config.url : `${baseUrl}${endpoint}`;

  return new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    activeXhr = xhr;

    xhr.open("POST", fullUrl, true);
    xhr.withCredentials = true;

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.setRequestHeader("Accept", "application/json");

    // Track real network upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        store.dispatch(
          updateProgress({
            progress: percent,
            loadedBytes: event.loaded,
            totalBytes: event.total,
          }),
        );

        if (percent >= 99) {
          store.dispatch(setStage("processing"));
        }
      }
    };

    xhr.onload = () => {
      activeXhr = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          const successMsg = res.message || "Post published successfully!";
          store.dispatch(setSuccess(successMsg));

          // Invalidate cache and notify feed
          store.dispatch(baseApiSlice.util.invalidateTags(["Post", "group"]));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("post-created"));
          }

          toast.success(successMsg);

          // Auto-dismiss dock after 4.5 seconds
          dismissTimer = setTimeout(() => {
            store.dispatch(dismissUpload());
          }, 4500);

          resolve(res);
        } catch {
          store.dispatch(setSuccess("Post published successfully!"));
          store.dispatch(baseApiSlice.util.invalidateTags(["Post", "group"]));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("post-created"));
          }
          dismissTimer = setTimeout(() => {
            store.dispatch(dismissUpload());
          }, 4500);
          resolve({ success: true });
        }
      } else {
        let errorMsg = "Failed to publish post.";
        try {
          const res = JSON.parse(xhr.responseText);
          errorMsg = res?.message || errorMsg;
        } catch {}
        store.dispatch(setError(errorMsg));
        toast.error(errorMsg);
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      activeXhr = null;
      const errorMsg = "Network error occurred during upload. Please check your connection.";
      store.dispatch(setError(errorMsg));
      toast.error(errorMsg);
      reject(new Error(errorMsg));
    };

    xhr.ontimeout = () => {
      activeXhr = null;
      const errorMsg = "Upload timed out. The file might be too large or the server is busy.";
      store.dispatch(setError(errorMsg));
      toast.error(errorMsg);
      reject(new Error(errorMsg));
    };

    xhr.onabort = () => {
      activeXhr = null;
      store.dispatch(dismissUpload());
      toast("Upload cancelled.");
    };

    xhr.send(config.formData);
  });
}

export function cancelBackgroundPostUpload() {
  if (activeXhr) {
    try {
      activeXhr.abort();
    } catch {}
    activeXhr = null;
  }
  store.dispatch(dismissUpload());
}

export function retryBackgroundPostUpload() {
  if (lastConfig) {
    startBackgroundPostUpload(lastConfig);
  }
}
