
type RouteConfig = {
    label: string | ((...args: string[]) => string);
    href: string;
    buildHref?: (...parts: string[]) => string;
};

export const routes: Record<string, RouteConfig> = {
    home: {
        label: "Academia",
        href: "/mu/academia",
    },
    stateacademia: {
        label: (_id: string, stateName?: string) => {
            if (stateName) {
                return `${stateName}`;
            }
            return "State Academia";
        },
        href: "/mu/state/",
        buildHref: (id: string, _stateName: string) => `/mu/academia/${id}`,
    },
    undergradgradprograms: {
        label: "Undergrad & Grad Programs",
        href: "/",
        buildHref: (stateId: string) => `/mu/academia/${stateId}/grad-undergrad-programs`,
    },
    hospitals: {
        label: "Hospitals",
        href: "/",
        buildHref: (stateId: string) => `/mu/academia/${stateId}/hospitals`,
    },
    medicalresidencies: {
        label: "Medical Residencies",
        href: "/",
        buildHref: (stateId: string) => `/mu/academia/${stateId}/medical-residencies`,
    },
    employmentopportunities: {
        label: "Employment Opportunities",
        href: "/",
        buildHref: (stateId: string) => `/mu/academia/${stateId}/employment-opportunities`,
    }
};

export const parseRouteToken = (token?: string | null) => {
    const [rawKey, ...rawParts] = (token || "").split(":");
    const key = rawKey?.trim();
    const parts = rawParts.filter(Boolean);

    return {
        key,
        parts,
    };
};

export const getRouteConfig = (keyOrToken?: string | null): RouteConfig | undefined => {
    const { key } = parseRouteToken(keyOrToken);

    if (!key) {
        return undefined;
    }

    return routes[key];
};

export const getRouteHref = (keyOrToken: string, ...parts: string[]) => {
    const parsed = parseRouteToken(keyOrToken);
    const route = getRouteConfig(parsed.key);
    const resolvedParts = parts.length > 0 ? parts : parsed.parts;

    if (!route) {
        return "/";
    }

    if (route.buildHref) {
        return route.buildHref(...resolvedParts);
    }

    return route.href;
};

export const getRouteLabel = (keyOrToken: string, ...args: string[]): string => {
    const route = getRouteConfig(keyOrToken);
    if (!route) return "";
    if (typeof route.label === "function") {
        return route.label(...args);
    }
    return route.label;
};