import { Layout } from "../components/Layout";
import type { Session } from "../lib/api";

export function AdminPage({ session }: { session: Session }) {
	return (
		<Layout session={session}>
			<div className="space-y-4">
				<div>
					<h1 className="text-lg font-semibold tracking-tight">Admin</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Admin settings and configuration.
					</p>
				</div>
				<p className="text-sm text-muted-foreground">
					Admin functionality has moved to the respective Team, CDTs, and
					Meetings pages under the "Manage" tabs.
				</p>
			</div>
		</Layout>
	);
}
