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
