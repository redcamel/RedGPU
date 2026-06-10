export declare class Fpswatch {
    private start_;
    private duration_;
    private fps_;
    private frameCount_;
    private timestamps_;
    get duration(): number;
    get fps(): number | null;
    begin(now: Date): void;
    private calculateFps_;
    private compactTimestamps_;
    end(now: Date): void;
}
