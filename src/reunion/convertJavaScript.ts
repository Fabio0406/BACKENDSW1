export class JavaScriptConverter {
    static convertToJavaScript(nodeDataArray, linkDataArray) {
        let jsCode = '';

        // Convertir nodos en clases JavaScript con conexiones
        nodeDataArray.forEach(node => {
            let className = 'undefined';
            if (node.text) {
                className = node.text.split(':')[0].trim();
                const connections = this.getConnections(node, linkDataArray);
                jsCode += `class ${className} {\n`;
                jsCode += `    constructor() {\n`;
                jsCode += `        this.name = "${node.text}";\n`;
                jsCode += `        this.connections = [${connections}];\n`;
                jsCode += `        console.log("Creating ${className} object with connections: " + this.connections);\n`;
                jsCode += `    }\n\n`;
                jsCode += `    getName() {\n`;
                jsCode += `        return this.name;\n`;
                jsCode += `    }\n\n`;
                jsCode += `    getConnections() {\n`;
                jsCode += `        return this.connections;\n`;
                jsCode += `    }\n\n`;
                jsCode += `    setConnections(connections) {\n`;
                jsCode += `        this.connections = connections;\n`;
                jsCode += `    }\n}\n\n`;
            } else if (node.group && node.group.text) {
                className = node.group.text.split(':')[0].trim();
                const connections = this.getConnections(node, linkDataArray);
                jsCode += `class ${className} {\n`;
                jsCode += `    constructor() {\n`;
                jsCode += `        this.name = "${node.group.text}";\n`;
                jsCode += `        this.connections = [${connections}];\n`;
                jsCode += `        console.log("Creating ${className} object with connections: " + this.connections);\n`;
                jsCode += `    }\n\n`;
                jsCode += `    getName() {\n`;
                jsCode += `        return this.name;\n`;
                jsCode += `    }\n\n`;
                jsCode += `    getConnections() {\n`;
                jsCode += `        return this.connections;\n`;
                jsCode += `    }\n\n`;
                jsCode += `    setConnections(connections) {\n`;
                jsCode += `        this.connections = connections;\n`;
                jsCode += `    }\n}\n\n`;
            }
        });

        return jsCode;
    }

    static getConnections(node, linkDataArray) {
        const connections = [];
        linkDataArray.forEach(link => {
            if (link.from === node.key) {
                const toNode = link.to;
                const text = link.text;
                connections.push(`${toNode}["${text}"]`);
            }
        });
        return connections.join(', ');
    }
}
