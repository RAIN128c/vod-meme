import type { PropsWithChildren } from "react";

import { AppShell } from "@/components/app-shell";

const MainLayout = ({ children }: PropsWithChildren) => <AppShell>{children}</AppShell>;

export default MainLayout;
