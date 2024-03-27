import type { RouteLocationRaw } from "vue-router";

export const useRedirectIfAuthenticated = (url: RouteLocationRaw = "/") => {
  const user = useSupabaseUser();

  watch(
    user,
    (user) => {
      if (user) {
        return navigateTo(url);
      }
    },
    { immediate: true },
  );

  return { user };
};
