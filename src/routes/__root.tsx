import { ScrollRestoration } from "@tanstack/react-router";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: () => (
    <div className="background-gradient">
      <ScrollRestoration scrollBehavior="smooth" />
      <Outlet />
      {process.env.NODE_ENV !== "production" && (
        <Suspense fallback={null}>
          <TanStackRouterDevtools />
        </Suspense>
      )}
    </div>
  ),
});
