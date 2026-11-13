import { makeScene2D, Circle, Rect, Txt } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#165d4a');
  const box = createRef<Rect>();
  const title = createRef<Txt>();
  view.add(
    <>
      <Txt ref={title} text={"\u2067مرحباً من Motion Canvas\u2069"} fontFamily="Alexandria" fontSize={90} fill="#e6e7e8" y={-300} opacity={0} />
      <Rect ref={box} width={240} height={240} radius={30} fill="#cdb69e" x={-400} />
    </>,
  );
  yield* title().opacity(1, 0.6);
  yield* all(box().position.x(400, 1), box().rotation(180, 1), box().radius(120, 1));
  yield* waitFor(0.4);
});
