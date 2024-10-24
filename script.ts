enum Color {
    RED,
    BLACK
}

interface TreeNodePosition {
    value: number;
    color: "red" | "black"; // Cambiar de string a tipo literal
    x: number;
    y: number;
    left: TreeNodePosition | null;
    right: TreeNodePosition | null;
}


class TreeNode {
    value: number;
    color: Color;
    left: TreeNode | null = null;
    right: TreeNode | null = null;
    parent: TreeNode | null = null;

    constructor(value: number, color: Color) {
        this.value = value;
        this.color = color;
    }

    isRed(): boolean {
        return this.color === Color.RED;
    }
}

class RedBlackTree {
    root: TreeNode | null = null;

    insert(value: number): void {
        // Lógica para insertar el nodo en el árbol
        const newNode = new TreeNode(value, Color.RED);
        // Lógica para insertar el nodo correctamente y balancear
        this.render();
    }

    delete(value: number): void {
        // Lógica para eliminar un nodo del árbol
        this.render();
    }

    search(value: number): TreeNode | null {
        let current = this.root;
        while (current) {
            if (value === current.value) {
                return current;
            } else if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return null;
    }

    inorder(): number[] {
        const result: number[] = [];
        this.inorderTraversal(this.root, result);
        return result;
    }

    preorder(): number[] {
        const result: number[] = [];
        this.preorderTraversal(this.root, result);
        return result;
    }

    postorder(): number[] {
        const result: number[] = [];
        this.postorderTraversal(this.root, result);
        return result;
    }

    private inorderTraversal(node: TreeNode | null, result: number[]): void {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.value);
            this.inorderTraversal(node.right, result);
        }
    }

    private preorderTraversal(node: TreeNode | null, result: number[]): void {
        if (node) {
            result.push(node.value);
            this.preorderTraversal(node.left, result);
            this.preorderTraversal(node.right, result);
        }
    }

    private postorderTraversal(node: TreeNode | null, result: number[]): void {
        if (node) {
            this.postorderTraversal(node.left, result);
            this.postorderTraversal(node.right, result);
            result.push(node.value);
        }
    }

    render(): void {
        const treeLayout = this.calculateTreeLayout(this.root);
        const svgElement = document.getElementById("tree-canvas");

        if (!(svgElement instanceof SVGSVGElement)) {
            console.error("El elemento SVG no fue encontrado o no es del tipo correcto.");
            return;
        }

        // Limpiar el contenido previo del SVG antes de dibujar el nuevo estado
        svgElement.innerHTML = '';

        // Dibujar el árbol a partir de su disposición calculada
        if (treeLayout) {
            this.drawTree(svgElement, treeLayout);
        }
    }

    private calculateTreeLayout(
        node: TreeNode | null,
        x: number = 400,
        y: number = 50,
        level: number = 1
    ): TreeNodePosition | null {
        if (!node) return null;

        const nodePosition: TreeNodePosition = {
            value: node.value,
            color: node.color === Color.RED ? "red" : "black",
            x,
            y,
            left: this.calculateTreeLayout(node.left, x - 100 / level, y + 60, level + 1),
            right: this.calculateTreeLayout(node.right, x + 100 / level, y + 60, level + 1),
        };

        return nodePosition;
    }

    private drawTree(svg: SVGSVGElement, root: TreeNodePosition): void {
        // Función recursiva para dibujar el árbol
        const drawNode = (node: TreeNodePosition | null) => {
            if (!node) return;

            // Dibujar conexiones entre nodos
            if (node.left) {
                this.drawLine(svg, node.x, node.y, node.left.x, node.left.y);
                drawNode(node.left);
            }
            if (node.right) {
                this.drawLine(svg, node.x, node.y, node.right.x, node.right.y);
                drawNode(node.right);
            }

            // Dibujar el nodo
            this.drawCircle(svg, node.x, node.y, node.value, node.color);
        };

        drawNode(root);
    }

    private drawLine(svg: SVGSVGElement, x1: number, y1: number, x2: number, y2: number): void {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1.toString());
        line.setAttribute("y1", y1.toString());
        line.setAttribute("x2", x2.toString());
        line.setAttribute("y2", y2.toString());
        line.setAttribute("stroke", "#e0e0e0"); // Color claro para que se vea bien en un fondo oscuro
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
    }

    private drawCircle(svg: SVGSVGElement, x: number, y: number, value: number, color: "red" | "black"): void {
        // Dibujar el círculo
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", "20"); // Tamaño del nodo
        circle.setAttribute("fill", color); // Relleno con el color del nodo (rojo o negro)

        // Dibujar el texto del nodo
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x.toString());
        text.setAttribute("y", (y + 5).toString()); // Centrar el texto verticalmente
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white"); // Texto blanco para que resalte en nodos oscuros
        text.textContent = value.toString();

        svg.appendChild(circle);
        svg.appendChild(text);
    }
}

class TreeApp {
    private tree: RedBlackTree;

    constructor() {
        this.tree = new RedBlackTree();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        const insertButton = document.getElementById('insert-button')!;
        const deleteButton = document.getElementById('delete-button')!;
        const searchButton = document.getElementById('search-button')!;
        const traverseButton = document.getElementById('traverse-button')!;
        const orderSelect = document.getElementById('order-select') as HTMLSelectElement;

        insertButton.addEventListener('click', () => {
            const nodeValue = parseInt((document.getElementById('node-value') as HTMLInputElement).value);
            if (isNaN(nodeValue)) {
                alert('Ingresa un número!');
                return;
            }
            this.tree.insert(nodeValue);
            this.tree.render();
        });

        deleteButton.addEventListener('click', () => {
            const nodeValue = parseInt((document.getElementById('node-value') as HTMLInputElement).value);
            if (isNaN(nodeValue)) {
                alert('Ingresa un número!');
                return;
            }
            this.tree.delete(nodeValue);
            this.tree.render();
        });

        searchButton.addEventListener('click', () => {
            const nodeValue = parseInt((document.getElementById('node-value') as HTMLInputElement).value);
            const result = this.tree.search(nodeValue);
            this.showNodeDetails(result);
        });

        traverseButton.addEventListener('click', () => {
            const orderType = orderSelect.value;
            let result: number[] = [];
            if (orderType === 'inorder') {
                result = this.tree.inorder();
            } else if (orderType === 'preorder') {
                result = this.tree.preorder();
            } else if (orderType === 'postorder') {
                result = this.tree.postorder();
            }
            alert(`Resultado (${orderType}): ${result.join(', ')}`);
        });
    }

    private showNodeDetails(node: TreeNode | null) {
        const detailsElement = document.getElementById('node-details')!;
        if (node) {
            detailsElement.textContent = `Nodo encontrado: Valor = ${node.value}, Color = ${node.isRed() ? 'Rojo' : 'Negro'}`;
        } else {
            detailsElement.textContent = 'Nodo no encontrado';
        }
    }
}

// Inicializamos el árbol cuando la ventana carga
window.onload = () => {
    new TreeApp();
};