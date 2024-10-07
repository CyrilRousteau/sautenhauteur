// Fonction pour ajouter un joueur
function addPlayer(x, y, animation) {
    const playerSprite = this.add.sprite(x, y, 'Idle');
    playerSprite.setScale(2.1);
    playerSprite.play(animation);
    return {
        sprite: playerSprite
    };
}

class StartScene extends Phaser.Scene {
    constructor() {
      super({ key: 'StartScene' });
    }
  
    preload() {
      this.load.image('startBg', 'assets/regle_saut.png');
      this.load.image('startButton', 'assets/btn.png');
    }
  
    create() {
      const background = this.add.image(0, 0, 'startBg').setOrigin(0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
  
      const centerX = this.sys.game.config.width / 2;
      const bottomY = this.sys.game.config.height - 50;
  
      const startButton = this.add.image(centerX, bottomY, 'startButton')
        .setOrigin(0.5, 1)
        .setInteractive();
  
      startButton.on('pointerdown', () => {
        this.scene.start('StadeScene');
      });
    }
  }

class StadeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StadeScene' });
        this.elapsedTime = 0; 
    }

    preload() {
        this.load.image('fond', 'assets/fond.png');
        this.load.image('bar', 'assets/bar.png');
        this.load.spritesheet('Idle', 'assets/Idle.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('Run', 'assets/Run.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('Jump', 'assets/Jump.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('Dead', 'assets/Dead.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('arrowUp', 'assets/arrow_up.png');
        this.load.image('arrowDown', 'assets/arrow_down.png');
        this.load.image('arrowLeft', 'assets/arrow_left.png');
        this.load.image('arrowRight', 'assets/arrow_right.png');
    }

    create() {
        this.background = this.add.image(0, 0, 'fond').setOrigin(0, 0);
        this.background.displayWidth = this.scale.width; 
        this.background.displayHeight = this.scale.height;

        this.bar = this.add.image(this.scale.width - 200, this.scale.height - 200, 'bar');

        this.anims.create({
            key: 'idleAnimation',
            frames: this.anims.generateFrameNumbers('Idle', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'runAnimation',
            frames: this.anims.generateFrameNumbers('Run', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jumpAnimation',
            frames: this.anims.generateFrameNumbers('Jump', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'deadAnimation',
            frames: this.anims.generateFrameNumbers('Dead', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: 0
        });

        this.idleSprite = this.add.sprite(this.scale.width / 8, this.scale.height - 180, 'Idle');
        this.idleSprite.setScale(2.1);
        this.idleSprite.play('idleAnimation');

        this.generateSequence(5);
        this.showSequence();

        this.gameOver = false;

        this.time.addEvent({
            delay: 1000, 
            callback: () => {
                this.elapsedTime += 1; 
            },
            loop: true 
        });

         this.input.keyboard.on('keydown', (event) => {
        if (!this.gameOver) {
            const pressedKey = event.key.toLowerCase();
            if (pressedKey === this.sequence[this.sequenceIndex].toLowerCase()) {
                this.sequenceIndex++;
                if (this.sequenceIndex === this.sequence.length) {
                    console.log('Séquence terminée avec succès !');
                    this.idleSprite.destroy();
                    this.runSprite = this.add.sprite(this.scale.width / 8, this.scale.height - 180, 'Run');
                    this.runSprite.setScale(2.1);
                    this.runSprite.play('runAnimation');

                    this.tweens.add({
                        targets: this.runSprite,
                        x: this.runSprite.x + 350,
                        duration: 800,
                        ease: 'Linear',
                        onComplete: () => {
                            this.runSprite.destroy();
                            this.jumpSprite = this.add.sprite(this.runSprite.x, this.runSprite.y, 'Jump');
                            this.jumpSprite.setScale(2.1);
                            this.jumpSprite.play('jumpAnimation');

                            this.tweens.add({
                                targets: this.jumpSprite,
                                y: this.jumpSprite.y - 250,
                                duration: 500,
                                ease: 'Quad.easeInOut',
                                yoyo: true,
                                repeat: 0,
                                onComplete: () => {
                                    this.idleSprite = this.add.sprite(this.jumpSprite.x, this.jumpSprite.y - 50, 'Idle');
                                    this.idleSprite.setScale(2.1);
                                    this.idleSprite.play('idleAnimation');
                                    this.jumpSprite.destroy();

                                    setTimeout(() => {
                                        this.onSuccess();
                                    }, 1500);
                                }
                            });

                            this.tweens.add({
                                targets: this.jumpSprite,
                                x: this.jumpSprite.x + 300,
                                duration: 1000,
                                ease: 'Linear'
                            });
                        }
                    });
                }
            } else {
                this.gameOver = true; 
                console.log('Mauvaise touche ! Séquence échouée !');
                this.idleSprite.destroy();
                this.runSprite = this.add.sprite(this.scale.width / 8, this.scale.height - 180, 'Run');
                this.runSprite.setScale(2.1);
                this.runSprite.play('runAnimation');

                this.tweens.add({
                    targets: this.runSprite,
                    x: this.runSprite.x + 350,
                    duration: 800,
                    ease: 'Linear',
                    onComplete: () => {
                        this.runSprite.destroy();
                        this.jumpSprite = this.add.sprite(this.runSprite.x, this.runSprite.y, 'Jump');
                        this.jumpSprite.setScale(2.1);
                        this.jumpSprite.play('jumpAnimation');

                        this.tweens.add({
                            targets: this.jumpSprite,
                            y: this.jumpSprite.y - 250,
                            duration: 500,
                            ease: 'Quad.easeInOut',
                            yoyo: true,
                            repeat: 0,
                            onComplete: () => {
                                this.deadSprite = this.add.sprite(this.jumpSprite.x - 50, this.jumpSprite.y - 50, 'Dead');
                                this.deadSprite.setScale(2.1);
                                this.deadSprite.play('deadAnimation');
                                this.jumpSprite.destroy();

                                setTimeout(() => {
                                    this.onFail();
                                }, 1500);
                            }
                        });

                        this.tweens.add({
                            targets: this.jumpSprite,
                            x: this.jumpSprite.x + 300,
                            duration: 1000,
                            ease: 'Linear'
                        });
                    }
                });
            }
        }
    });
    }

    onFail() {
        this.scene.stop('StadeScene');
        this.scene.start('DefeatScene');
    }

    onSuccess() {
        this.scene.stop('StadeScene'); 
        this.scene.start('VictoryScene', { elapsedTime: this.elapsedTime });
    }

    generateSequence(length) {
        this.sequence = [];
        var keys = ['arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight'];
        for (var i = 0; i < length; i++) {
            var randomIndex = Phaser.Math.Between(0, keys.length - 1);
            this.sequence.push(keys[randomIndex]);
        }
        this.sequenceIndex = 0;
    }

    showSequence() {
        const startX = 100;
        const startY = 100;
        const offsetX = 100;
        const scale = 0.2;
        for (let i = 0; i < this.sequence.length; i++) {
            const key = this.sequence[i];
            const image = this.add.image(startX + i * offsetX, startY, key);
            image.setScale(scale);
        }
    }
}

class DefeatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DefeatScene' });
    }

    preload() {
        this.load.image('background', 'assets/score.png');
        this.load.image('retryButton', 'assets/btn.png');
    }

    create() {
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.displayWidth = this.scale.width;
        this.background.displayHeight = this.scale.height;

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, 'Dommage', { fontSize: '48px', fill: '#000', align: 'center'}).setOrigin(0.5);

        const retryButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, 'retryButton').setInteractive();
        retryButton.setScale(0.5); 

        retryButton.on('pointerdown', () => {
            this.scene.start('StadeScene'); 
        });
    }
}


class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    preload() {
        this.load.image('fondVictory', 'assets/scorelv1.png'); 
        this.load.image('buttonImage', 'assets/niveau2.png'); 
    }

    create(data) {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'fondVictory').setDisplaySize(this.scale.width, this.scale.height);

        const elapsedTimeText = `${data.elapsedTime} secondes`;
        this.add.text(this.scale.width / 2, this.scale.height / 2 +20, elapsedTimeText, { fontSize: '32px', fill: '#000' })
            .setOrigin(0.5)
            .setAlign('center'); 

        const nextLevelButton = this.add.image(this.scale.width / 2, this.scale.height - 100, 'buttonImage') 
            .setInteractive()
            .setOrigin(0.5);

        nextLevelButton.on('pointerdown', () => {
            this.scene.start('StadeScene'); 
        });
    }
}


var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 480,
    scene: [StartScene, StadeScene, DefeatScene, VictoryScene],
};

var game = new Phaser.Game(config);
