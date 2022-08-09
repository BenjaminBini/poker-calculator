import { analyze } from "../eval/calculator";

/* eslint-disable */
self.onmessage = ({ data: { hands, fullBoard } }) => {
  analyze(hands, fullBoard, self.postMessage, self.close);
}; /* eslint-enable */
