import { pathToRegexp } from "path-to-regexp";

const routes: string[] = ["/management"];

export function isRoleAllowed(path: string): boolean {
  const route = routes.find((route) => {
    const regex = pathToRegexp(route);
    return regex.regexp.test(path);
  });

  console.log(route);

  if (!route) return false;

  return true;
}
