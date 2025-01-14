import * as net from "net";

export async function isServerAvailable(url: string, port: number, timeout = 3000): Promise<boolean> {
    return new Promise((resolve) => {
        try {

            const { hostname, port } = new URL(url);

            const socket = new net.Socket();
            socket.setTimeout(timeout);

            socket.connect(Number(port), hostname, () => {
                socket.destroy();
                resolve(true);
            });

            socket.on("error", () => {
                socket.destroy();
                resolve(false);
            });

            socket.on("timeout", () => {
                socket.destroy();
                resolve(false);
            });
        } catch (error) {
            console.error("Invalid URL provided:", error);
            resolve(false);
        }
    });
}

