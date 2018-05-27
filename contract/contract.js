'use strict'

var GameItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.title = obj.title;//游戏名称
        this.id = obj.id;//游戏id
        this.score = obj.score;//得分
        this.author = obj.author;//账户
    }
};

GameItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var TheGame = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new GameItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

TheGame.prototype = {
    init: function () {

    },

    save: function (id, title, score) {
        var author = Blockchain.transaction.from;
        if (!author || !score) {
            throw new Error("empty author or score");
        }

        var gameItem = this.data.get(author);
        if (gameItem) {
            if (gameItem.score < score) {
                gameItem.score = score
                this.data.set(author, gameItem);
            }
            return this.data.get(author);
        }

        gameItem = new GameItem();
        gameItem.author = author;
        gameItem.title = title;
        gameItem.id = id;
        gameItem.score = score;

        this.data.set(author, gameItem);
        return this.data.get(author);
    },

    get: function () {
        var author = Blockchain.transaction.from;
        if (!author) {
            return "empty author";
        }
        return this.data.get(author);
    }
}

module.exports = TheGame;