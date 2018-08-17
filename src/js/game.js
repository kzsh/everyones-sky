class Game {

    constructor() {
        if (DEBUG) {
            console.log('Game starting woohoo');
        }

        U = new Universe();
        V = new Camera();

        this.clock = 0;
    }

    cycle(e) {
        this.clock += e;

        U.cycle(e);
        INTERPOLATIONS.slice().forEach(i => i.cycle(e));

        U.render();

        // Render HUD
        R.font = '24pt Courier';
        R.fillStyle = '#fff';

        wrap(() => {
            translate(50, 45);
            scale(0.5, 0.5);

            beginPath();
            moveTo(0, -15)
            lineTo(14, -10);
            lineTo(10, 10);
            lineTo(0, 18);
            lineTo(-10, 10);
            lineTo(-14, -10);
            fill();
        });

        R.fillStyle = 'rgba(128,128,128,0.5)';
        fr(100, 50 - 10, 200, 10);

        R.fillStyle = '#fff';
        fr(100, 50 - 10, 100, 10);
        fr(300, 50 - 10, 2, 10);
    }

}