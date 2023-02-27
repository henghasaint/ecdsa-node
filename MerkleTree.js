class MerkleTree {

    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
        this.hashes = [];
        this.hashes[0] = [...leaves];
        this.layer = 1;
    }

    getRoot() {
        let leavesLength = this.leaves.length;

        if (leavesLength > 0) {
            this.layer = Math.ceil(Math.pow(leavesLength, 1 / 2)) + 1;
            if (this.leaves.length % 2 != 0) {
                this.layer = this.layer + 1;
            }
            let localHashes = [];
            let j = 0;

            for (let i = 1; i < this.layer; i++) {
                j = 0;
                localHashes = [];
                while (j < this.hashes[i - 1].length) {
                    if (this.hashes[i - 1][j + 1]) {
                        localHashes.push(this.concat(this.hashes[i - 1][j], this.hashes[i - 1][j + 1]));
                    } else {
                        localHashes.push(this.hashes[i - 1][j]);
                    }

                    j = j + 2;
                }
                this.hashes[i] = [...localHashes];
            }
            if (this.hashes[this.layer - 1]) {
                return this.hashes[this.layer - 1][0];
            }

            return null;
        }

        return null;
    }

    getProof(find) {
        let proofArray = [];
        let temp = null;
        let index = find;
        let isIndexEven = false;
        let indexUsed = 0;
        this.getRoot();
        for(let i = 0 ; i < this.layer - 1; i++) {
            isIndexEven = (index % 2 === 0);

            indexUsed = isIndexEven ? index + 1 : index - 1;
            if (this.hashes[i][indexUsed]) {
                temp = {data: this.hashes[i][indexUsed], left: !isIndexEven};
                proofArray.push(temp);
            }
            index = Math.floor(index / 2);
        }
        return proofArray;
    }
}

module.exports = MerkleTree;

/**
 *  leaves: [A,B,C] Test Passed
 * layer: [ 'Hash(A + B)', 'C' ]
 * layer: [ 'Hash(Hash(A + B) + C)' ]
 *
 * leaves: [A,B,C,D] Test Passed
 * layer: [ 'Hash(A + B)', 'Hash(C + D)' ]
 * layer: [ 'Hash(Hash(A + B) + Hash(C + D))' ]
 * 
 */



//#####the answer
class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
    }
    getRoot(leaves = this.leaves) {
        if (leaves.length === 1) {
            return leaves[0];
        }
        const layer = [];
        for (let i = 0; i < leaves.length; i += 2) {
            if (leaves[i + 1]) {
                layer.push(this.concat(leaves[i], leaves[i + 1]));
            }
            else {
                layer.push(leaves[i]);
            }
        }
        return this.getRoot(layer);
    }
//leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    getProof(index, layer = this.leaves, proof = []) {
        if (layer.length === 1) return proof;
        const newLayer = [];
        for (let i = 0; i < layer.length; i += 2) {
            let left = layer[i];
            let right = layer[i + 1];
            if (!right) { // there isn't a leaf on the right
                newLayer.push(left);
            }
            else {
                // select two leaves if there is a leaf on the right
                newLayer.push(this.concat(left, right));

                if (i === index || i === index - 1) {
                    let isRight = (index % 2); // isRight is false when index is 0
                    proof.push({
                        // select right leaf when index is 0
                        data: !isRight ? right : left,
                        // selected leaf is on the right side when index is 0
                        left: isRight // false
                    });
                }
            }
        }
        return this.getProof(Math.floor(index / 2), newLayer, proof);
    }
}

module.exports = MerkleTree;


