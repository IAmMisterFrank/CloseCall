class Wheel extends HTMLElement {
    constructor(car, offsetCarX) {
        super();
        this.style.transform = `translate(${offsetCarX}px, 30px)`;
        car.appendChild(this);
    }
}
window.customElements.define("wheel-component", Wheel);
class Car extends HTMLElement {
    constructor(yIndex) {
        super();
        this.x = 0;
        this.y = 0;
        this.speed = Math.random() * 2 + 1;
        this.braking = false;
        this.stopped = false;
        this.X = 0;
        this.Y = (70 * yIndex) + 80;
        let frontWheel = new Wheel(this, 105);
        let rearWheel = new Wheel(this, 20);
        document.addEventListener("keydown", (e) => this.handleKeyDown(e));
        this.addEventListener("click", (e) => this.handleMouseClick(e));
        let parent = document.getElementById("container");
        parent.appendChild(this);
    }
    get Speed() { return this.speed; }
    get X() { return this.x; }
    set X(value) { this.x = value; }
    get Y() { return this.y; }
    set Y(value) { this.y = value; }
    get width() { return this.clientWidth; }
    get height() { return this.clientHeight; }
    handleMouseClick(e) {
        this.braking = true;
        this.changeColor(80);
    }
    handleKeyDown(e) {
        if (e.key == ' ') {
            this.braking = true;
        }
    }
    move() {
        this.X += this.speed;
        if (this.braking)
            this.speed *= 0.98;
        if (this.speed < 0.5)
            this.speed = 0;
        if (this.speed == 0 && this.braking && !this.stopped) {
            this.changeColor(80);
            Game.Instance.addScore(this.X);
            this.braking = false;
            this.stopped = true;
        }
        this.draw();
    }
    crash() {
        this.speed = 0;
        this.braking = false;
        this.changeColor(300);
    }
    changeColor(deg) {
        this.style.filter = `hue-rotate(${deg}deg)`;
    }
    draw() {
        this.style.transform = `translate(${this.X}px,${this.Y}px)`;
    }
}
window.customElements.define("car-component", Car);
class Game {
    constructor() {
        this.cars = [];
        this.rocks = [];
        this.score = 0;
        this.request = 0;
        this.gameover = false;
        for (let i = 0; i < 6; i++) {
            this.addCarWithRock(i);
        }
        this.gameLoop();
    }
    static get Instance() {
        if (!Game.instance)
            Game.instance = new Game();
        return Game.instance;
    }
    addCarWithRock(index) {
        this.cars.push(new Car(index));
        this.rocks.push(new Rock(index));
    }
    gameLoop() {
        for (let car of this.cars) {
            car.move();
        }
        for (let rock of this.rocks) {
            rock.move();
        }
        this.checkCollision();
        this.request = requestAnimationFrame(() => this.gameLoop());
    }
    checkCollision() {
        for (let car of this.cars) {
            for (let rock of this.rocks) {
                if (this.hasCollision(car, rock)) {
                    rock.crashed(car.Speed);
                    car.crash();
                    this.gameOver();
                }
            }
        }
    }
    gameOver() {
        this.gameover = true;
        document.getElementById("score").innerHTML = "Game Over";
        cancelAnimationFrame(this.request);
    }
    addScore(x) {
        if (!this.gameover) {
            this.score += Math.floor(x);
            this.draw();
        }
    }
    draw() {
        document.getElementById("score").innerHTML = "Score : " + this.score;
    }
    hasCollision(rect1, rect2) {
        return (rect1.X < rect2.X + rect2.width &&
            rect1.X + rect1.width > rect2.X &&
            rect1.Y < rect2.Y + rect2.height &&
            rect1.Y + rect1.height > rect2.Y);
    }
}
window.addEventListener("load", () => Game.Instance);
class Rock extends HTMLElement {
    constructor(index) {
        super();
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.g = 0;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.X = Math.random() * 400 + 400;
        this.Y = (70 * index) + 80;
        let parent = document.getElementById("container");
        parent.appendChild(this);
    }
    set Speed(s) { this.speed = s; }
    get X() { return this.x; }
    set X(value) { this.x = value; }
    get Y() { return this.y; }
    set Y(value) { this.y = value; }
    get width() { return this.clientWidth; }
    get height() { return this.clientHeight; }
    move() {
        this.X += this.speed;
        this.Y += this.g;
        this.speed *= 0.98;
        this.rotation += this.rotationSpeed;
        if (this.Y + this.clientHeight > document.getElementById("container").clientHeight) {
            this.speed = 0;
            this.g = 0;
            this.rotationSpeed = 0;
        }
        this.style.transform = `translate(${this.X}px, ${this.Y}px) rotate(${this.rotation}deg)`;
    }
    crashed(carSpeed) {
        this.g = 9.81;
        this.speed = carSpeed;
        this.rotationSpeed = 5;
    }
}
window.customElements.define("rock-component", Rock);
//# sourceMappingURL=main.js.map