import { WsMessage } from '../entities/WsMessage/WsMessage';

type WebSocketMessageHandler = (data: any) => void;

export class WebSocketManager {
    private socket: WebSocket;
    private pingInterval: number | undefined;
    public handler: any;

    constructor(url: string) {
        this.socket = new WebSocket(url);

        this.startPing();

        this.socket.addEventListener('message', (event) => {
            //console.log('WebSocket send message:', event.data);
            const info: WsMessage = JSON.parse(event.data);
            //console.log(this.handler);
            //console.log(info);
            this.handler.handleMessage(info as WsMessage);
        });

        this.socket.addEventListener('open', () => {
            //console.log('WebSocket connection opened');
        });

        this.socket.addEventListener('close', () => {
            //console.log('WebSocket connection closed');
        });

        this.socket.addEventListener('error', (error) => {
            //console.error('WebSocket error:', error);
        });
    }

    public close() {
        this.socket.close();
    }

    private startPing(): void {
        this.pingInterval = window.setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'ping' }));

            }
        }, 29000);
    }
}