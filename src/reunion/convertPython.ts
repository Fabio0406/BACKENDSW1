export class PythonConverter {
    static convertToPython(nodeDataArray: any[], linkDataArray: any[]): string {
        let pythonCode = '';

        // Crear un diccionario para almacenar las conexiones entre nodos
        const nodeConnections: { [key: string]: string[] } = {};

        // Convertir conexiones en el diccionario de conexiones entre nodos
        linkDataArray.forEach(link => {
            const fromNode = link.from;
            const toNode = link.to;
            const text = link.text;
            if (!nodeConnections[fromNode]) {
                nodeConnections[fromNode] = [];
            }
            nodeConnections[fromNode].push(`${toNode}["${text}"]`);
        });

        // Convertir nodos en clases Python con conexiones
        nodeDataArray.forEach(node => {
            let className = 'Undefined';
            if (node.text) {
                className = node.text.split(':')[0].trim();
                const connections = nodeConnections[node.key] || [];
                const connectionsString = connections.length > 0 ? `[${connections.join(', ')}]` : '[]';

                pythonCode += `class ${className}:\n`;
                pythonCode += `    def __init__(self):\n`;
                pythonCode += `        self.name = "${node.text}"\n`;
                pythonCode += `        self.connections = ${connectionsString}\n\n`;
                pythonCode += `    def __str__(self):\n`;
                pythonCode += `        return "${className} objeto con conexiones : {connectionsString}"\n\n`;
            } else if (node.group && node.group.text) {
                className = node.group.text.split(':')[0].trim();
                const connections = nodeConnections[node.key] || [];
                const connectionsString = connections.length > 0 ? `[${connections.join(', ')}]` : '[]';

                pythonCode += `class ${className}:\n`;
                pythonCode += `    def __init__(self):\n`;
                pythonCode += `        self.name = "${node.group.text}"\n`;
                pythonCode += `        self.connections = ${connectionsString}\n\n`;
                pythonCode += `    def __str__(self):\n`;
                pythonCode += `        return "${className} objeto con conexiones : {connectionsString}"\n\n`;
            }
        });

        return pythonCode;
    }
}
