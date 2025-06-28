/* eslint-disable @typescript-eslint/no-unused-vars */


class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];

    if (input && input.length > 0) {
      const inputChannel = input[0];

      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i];
        this.bufferIndex++;


        if (this.bufferIndex >= this.bufferSize) {

          const bufferCopy = new Float32Array(this.buffer);
          this.port.postMessage(bufferCopy);


          this.bufferIndex = 0;
          this.buffer.fill(0);
        }
      }
    }

    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);