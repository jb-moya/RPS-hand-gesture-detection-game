export default class AIPlayer {
    static weightedRandom = (probabilities) => {
        const total = probabilities.reduce((acc, prob) => acc + prob, 0);
        const randomValue = Math.random() * total;

        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (randomValue < cumulativeProbability) {
                return i;
            }
        }

        // This should not happen under normal circumstances, but just in case
        return probabilities.length - 1;
    };

    static adaptAiAttack = (playerAttackHistory) => {
        console.log("playerAttackHistory", playerAttackHistory);
        let counts = { rock: 1, paper: 1, scissors: 1 };

        for (let attack of playerAttackHistory) {
            counts[attack] += 1;
        }

        for (const choice in counts) {
            const count = counts[choice];
            if (count > 1) {
                counts[choice] -= 1;
            }
        }

        const total = Object.values(counts).reduce(
            (sum, count) => sum + count,
            0
        );

        const probabilities = [
            counts.scissors / total,
            counts.rock / total,
            counts.paper / total,
        ];

        console.log("probabilities", probabilities);

        return probabilities;
    };

    static randomAttack = () => {
        const choices = ["rock", "paper", "scissors"];
        return choices[Math.floor(Math.random() * choices.length)];
    };
}
