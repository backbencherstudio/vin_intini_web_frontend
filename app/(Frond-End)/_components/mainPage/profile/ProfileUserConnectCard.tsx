import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import Image from "next/image";

function ProfileUserConnectCard({ profile, borderb }: any) {
  return (
    <div>
      <article
        key={profile.id}
        className={` py-4 ${borderb ? "border-b border-borderColor" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white bg-bgLightColor shadow-sm ring-1 ring-borderColor/50">
            <Image
              src="/profile.png"
              alt={profile.name}
              width={148}
              height={148}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-base  font-semibold leading-[1.2] text-headerColor">
              {profile.name}
            </h4>
            <p className="mt-1 line-clamp-1 text-sm leading-[1.35] text-descriptionColor">
              {profile.role}
            </p>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-descriptionColor">
              <Image
                src="/profile.png"
                alt="mutual"
                width={24}
                height={24}
                className="h-5 w-5 rounded-full object-cover"
              />
              <span className="truncate">{profile.mutualText}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full mt-3">
          <button type="button" className={BUTTON_STYLES.primary}>
            Connect
          </button>
        </div>
      </article>
    </div>
  );
}

export default ProfileUserConnectCard;
