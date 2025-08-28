interface LaunchParams {
	readonly files?: FileSystemFileHandle[];
	readonly targetURL: string;
}

interface LaunchQueue {
	setConsumer(callback: (launchParams: LaunchParams) => void): void;
}

interface Window {
	launchQueue?: LaunchQueue;
}

interface PeriodicSyncManager {
	register(tag: string, options: { minInterval: number }): Priomise<void>;
	getTags(): Promise<string[]>;
	unregister(tag: string): Promise<void>;
}

interface ServiceWorkerRegistration {
	periodicSync?: PeriodicSyncManager;
}

interface PeriodicSyncEvent extends ExtendableEvent {
	tag: string;
}

interface ServiceWorkerGlobalScopeEventMap {
	periodicsync: PeriodicSyncEvent;
}
