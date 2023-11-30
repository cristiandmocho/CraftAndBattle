export class Engine {
  constructor() {
    this.deltaTime = 1 / 60;
    this.isRunning = false;
    this.isPaused = false;
    this.isStarted = false;
    this.gravity = 0.98;
  }

  static Lerp(v1, v2, t) {
    const result = v1 * (1 - t) + v2 * t;
    if (Math.abs(result) < 0.01) return 0;
    if (Math.abs(result) > 1) return 1;
    return result;
  }

  static deltaTime() {
    return this.deltaTime;
  }
}

export class Vector2 {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Vector2} vector
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  /**
   * @param {Vector2} vector
   */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  /**
   * @param {Vector2} vector
   */
  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
  }

  /**
   * @param {Vector2} vector
   */
  divide(vector) {
    this.x /= vector.x;
    this.y /= vector.y;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    const result = new Vector2(this.x / mag, this.y / mag);
    return result;
  }

  /**
   *
   * @param {Vector2} vector1
   * @param {Vector2} vector2
   * @param {Number} t
   * @returns
   */
  static Lerp(vector1, vector2, t) {
    if (Math.abs(t) < 0.01) return vector1;
    if (Math.abs(t) > 1) return vector2;

    if (!vector1 || !vector2) return vector1;
    if (vector1.x === vector2.x && vector1.y === vector2.y) return vector2;

    const result = new Vector2(
      Engine.Lerp(vector1.x, vector2.x, t),
      Engine.Lerp(vector1.y, vector2.y, t)
    );
    return result;
  }
}
