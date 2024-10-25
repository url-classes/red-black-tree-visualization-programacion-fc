enum Color {
    RED,
    BLACK
}

interface TreeNodePosition {
    value: number;
    color: "red" | "black";
    x: number;
    y: number;
    left: TreeNodePosition | null;
    right: TreeNodePosition | null;
    role?: string; // Agregamos la propiedad role
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
        const newNode = new TreeNode(value, Color.RED);
        console.log("Insertando nodo:", newNode);
    
        if (this.root === null) {
            this.root = newNode;
            console.log("El nodo se insertó como raíz:", newNode);
            this.fixViolations(newNode); // Llama a fixViolations para arreglar violaciones
        } else {
            let current: TreeNode | null = this.root;  
            let parent: TreeNode | null = null;
    
            // Encontrar la posición adecuada para insertar el nuevo nodo
            while (current !== null) {
                parent = current;  // Guardamos el nodo padre antes de cambiar 'current'
                if (value < current.value) {
                    current = current.left;
                } else {
                    current = current.right;
                }
            }
    
            // 'current' ahora es null, y 'parent' es el nodo padre donde insertaremos el nuevo nodo
            if (parent !== null) {
                newNode.parent = parent; // Asignamos el padre solo si no es null
                if (value < parent.value) {
                    parent.left = newNode;
                    console.log(`Insertado a la izquierda de ${parent.value}`);
                } else {
                    parent.right = newNode;
                    console.log(`Insertado a la derecha de ${parent.value}`);
                }
                this.fixViolations(newNode); // Llama a fixViolations para arreglar violaciones
            }
        }
    }
    
    private fixViolations(node: TreeNode): void {
        while (node !== this.root && node.parent && node.parent.isRed()) {
            const parent = node.parent;
            const grandparent = parent.parent;
    
            if (grandparent) { // Asegúrate de que grandparent no sea null
                if (parent === grandparent.left) {
                    const uncle = grandparent.right;
    
                    // Caso 1: Tío rojo
                    if (uncle && uncle.isRed()) {
                        parent.color = Color.BLACK;
                        uncle.color = Color.BLACK;
                        grandparent.color = Color.RED;
                        node = grandparent; // Subimos el nodo a la abuela
                    } else {
                        // Caso 2: Tío negro
                        if (node === parent.right) {
                            // Rotación izquierda
                            this.rotateLeft(parent);
                            node = parent; // Actualizamos el nodo a ser el padre
                        }
                        // Rotación derecha
                        parent.color = Color.BLACK;
                        grandparent.color = Color.RED;
                        this.rotateRight(grandparent);
                    }
                } else {
                    const uncle = grandparent.left;
    
                    // Caso 1: Tío rojo
                    if (uncle && uncle.isRed()) {
                        parent.color = Color.BLACK;
                        uncle.color = Color.BLACK;
                        grandparent.color = Color.RED;
                        node = grandparent; // Subimos el nodo a la abuela
                    } else {
                        // Caso 2: Tío negro
                        if (node === parent.left) {
                            // Rotación derecha
                            this.rotateRight(parent);
                            node = parent; // Actualizamos el nodo a ser el padre
                        }
                        // Rotación izquierda
                        parent.color = Color.BLACK;
                        grandparent.color = Color.RED;
                        this.rotateLeft(grandparent);
                    }
                }
            }
        }
    
        // Asegúrate de que la raíz sea negra
        if (this.root) { // Verifica si this.root no es nulo
            this.root.color = Color.BLACK;
        }
    }    
    
    // Métodos de rotación
    private rotateLeft(node: TreeNode): void {
        const newParent = node.right!;
        node.right = newParent.left;
        if (newParent.left) {
            newParent.left.parent = node;
        }
        newParent.parent = node.parent;
        if (!node.parent) {
            this.root = newParent; // Si el nodo es la raíz, actualiza la raíz
        } else if (node === node.parent.left) {
            node.parent.left = newParent;
        } else {
            node.parent.right = newParent;
        }
        newParent.left = node;
        node.parent = newParent;
    }
    
    private rotateRight(node: TreeNode): void {
        const newParent = node.left!;
        node.left = newParent.right;
        if (newParent.right) {
            newParent.right.parent = node;
        }
        newParent.parent = node.parent;
        if (!node.parent) {
            this.root = newParent;
        } else if (node === node.parent.right) {
            node.parent.right = newParent;
        } else {
            node.parent.left = newParent;
        }
        newParent.right = node;
        node.parent = newParent;
    }    

    delete(value: number): void {
        const nodeToDelete = this.findNode(this.root, value);
        if (nodeToDelete === null) {
            console.log("El nodo con el valor", value, "no se encontró en el árbol.");
            return;
        }
        
        console.log("Eliminando nodo:", nodeToDelete);
        
        this.root = this.deleteNode(this.root, nodeToDelete);
    }

    private findNode(node: TreeNode | null, value: number): TreeNode | null {
        if (node === null) {
            return null;
        }
        if (value === node.value) {
            return node;
        } else if (value < node.value) {
            return this.findNode(node.left, value);
        } else {
            return this.findNode(node.right, value);
        }
    }

    private deleteNode(root: TreeNode | null, nodeToDelete: TreeNode): TreeNode | null {
        if (root === null) return null;
        if (nodeToDelete.value < root.value) {
            root.left = this.deleteNode(root.left, nodeToDelete);
        } else if (nodeToDelete.value > root.value) {
            root.right = this.deleteNode(root.right, nodeToDelete);
        } else {
            // Nodo encontrado
            if (root.left === null) return root.right;
            if (root.right === null) return root.left;
            
            // Encontrar el sucesor
            let minLargerNode = this.findMin(root.right);
            root.value = minLargerNode.value;
            root.right = this.deleteNode(root.right, minLargerNode);
        }
        return root;
    }

    private findMin(node: TreeNode): TreeNode {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
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
        console.log("Renderizando árbol:", treeLayout); // Verificar si el layout se está calculando
        const svgElement = document.getElementById("tree-canvas");
    
        if (!(svgElement instanceof SVGSVGElement)) {
            console.error("El elemento SVG no fue encontrado o no es del tipo correcto.");
            return;
        }
    
        svgElement.innerHTML = '';
    
        if (treeLayout) {
            this.drawTree(svgElement, treeLayout);
        }
    }    

    private calculateTreeLayout(
        node: TreeNode | null,
        x: number = 300, // Cambiado a 300 para mover el árbol más a la izquierda
        y: number = 50,
        level: number = 1,
        parentRole: string | null = null
    ): TreeNodePosition | null {
        if (!node) return null;
    
        // Calcular la posición de los subárboles
        const leftSubtree = this.calculateTreeLayout(node.left, x - (100 / level), y + 60, level + 1, "hijo izquierdo");
        const rightSubtree = this.calculateTreeLayout(node.right, x + (100 / level), y + 60, level + 1, "hijo derecho");
    
        // Ajustar la posición x para centrar el nodo
        const nodePosition: TreeNodePosition = {
            value: node.value,
            color: node.color === Color.RED ? "red" : "black",
            x: x,
            y,
            left: leftSubtree,
            right: rightSubtree,
            role: parentRole || "raíz", // Asignar el rol aquí
        };
    
        return nodePosition;
    }

    private drawTree(svg: SVGSVGElement, root: TreeNodePosition): void {
        console.log("Dibujando árbol:", root);
        const drawNode = (node: TreeNodePosition | null) => {
            if (!node) return;
    
            if (node.left) {
                this.drawLine(svg, node.x, node.y, node.left.x, node.left.y);
                drawNode(node.left);
            }
            if (node.right) {
                this.drawLine(svg, node.x, node.y, node.right.x, node.right.y);
                drawNode(node.right);
            }
    
            this.drawCircle(svg, node.x, node.y, node.value, node.color, node.role!); // Usar el operador de aserción para evitar el error
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

    private drawCircle(svg: SVGSVGElement, x: number, y: number, value: number, color: "red" | "black", role: string): void {
        // Crear un círculo con un gradiente
        const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", `grad-${value}`);
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "100%");
        gradient.setAttribute("y2", "100%");

        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", color === "red" ? "#ffcccc" : "#666666"); // Color más claro
        stop1.setAttribute("stop-opacity", "1");

        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", color);
        stop2.setAttribute("stop-opacity", "1");

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        svg.appendChild(gradient);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", "15"); // Tamaño del nodo más pequeño
        circle.setAttribute("fill", `url(#grad-${value})`); // Usar el gradiente

        // Sombra
        const shadow = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        shadow.setAttribute("id", "shadow");
        shadow.innerHTML = `<feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="2" dy="2" />
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>`;
        
        svg.appendChild(shadow);
        circle.setAttribute("filter", "url(#shadow)");

        // Dibujar el texto del nodo
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x.toString());
        text.setAttribute("y", (y + 5).toString());
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.textContent = value.toString();

        // Dibujar el texto del rol
        const roleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        roleText.setAttribute("x", x.toString());
        roleText.setAttribute("y", (y - 10).toString()); // Colocar encima del nodo
        roleText.setAttribute("text-anchor", "middle");
        roleText.setAttribute("fill", "white");
        roleText.setAttribute("font-size", "12px"); // Ajustar tamaño de fuente
        roleText.textContent = role; // Mostrar el rol

        svg.appendChild(circle);
        svg.appendChild(text);
        svg.appendChild(roleText); // Añadir el texto del rol al SVG
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
            const nodeInput = document.getElementById('node-value') as HTMLInputElement;
            const nodeValue = parseInt((document.getElementById('node-value') as HTMLInputElement).value);
            if (isNaN(nodeValue)) {
                alert('Ingresa un número!');
                return;
            }
            this.tree.insert(nodeValue);
            this.tree.render();
            nodeInput.value = "";
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
