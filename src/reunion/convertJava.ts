
export class JavaConverter {
    static convertToJava(nodeDataArray: any[], linkDataArray: any[]): string {
        let javaCode = '';
        javaCode += `import java.util.List;\n`;
        javaCode += `import java.util.Arrays;\n\n`;

        
        const nodeConnections: { [key: string]: { [key: string]: string[] } } = {};

        // Convertir conexiones en el mapa de conexiones entre nodos
        linkDataArray.forEach(link => {
            const fromNode = link.from;
            const toNode = link.to;
            const text = link.text;
            if (!nodeConnections[fromNode]) {
                nodeConnections[fromNode] = {};
            }
            if (!nodeConnections[fromNode][toNode]) {
                nodeConnections[fromNode][toNode] = [];
            }
            nodeConnections[fromNode][toNode].push(text);
        });

        // Convertir nodos en clases Java con conexiones
        nodeDataArray.forEach(node => {
            let className = 'undefined';
            if (node.text) {
                className = node.text.split(':')[0].trim();
                const connections = nodeConnections[node.key] || {};
                const connectionStrings: string[] = [];

                Object.keys(connections).forEach(toNode => {
                    const texts = connections[toNode].map(text => `"${text}"`).join(', '); // Encierra los textos con comillas
                    connectionStrings.push(`${toNode}[${texts}]`);
                });

                const connectionsString = connectionStrings.join(', ');

                javaCode += `public class ${className} {\n`;
                javaCode += `    private String name = "${node.text}";\n`;
                javaCode += `    private List<String> connections = Arrays.asList(${connectionsString});\n\n`;
                javaCode += `    // Constructor\n`;
                javaCode += `    public ${className}() {\n`;
                javaCode += `        System.out.println("Creating ${className} object with connections: " + connections);\n`;
                javaCode += `    }\n\n\n`;
                javaCode += `    // Getter para name\n`;
                javaCode += `    public String getName() {\n`;
                javaCode += `        return this.name;\n`;
                javaCode += `    }\n\n`;
                javaCode += `    // Getter para connections\n`;
                javaCode += `    public List<String> getConnections() {\n`;
                javaCode += `        return this.connections;\n`;
                javaCode += `    }\n\n`;
                javaCode += `    // Setter para connections\n`;
                javaCode += `    public void setConnections(List<String> connections) {\n`;
                javaCode += `        this.connections = connections;\n`;
                javaCode += `    }\n}\n\n`;
            } else if (node.group && node.group.text) {
                className = node.group.text.split(':')[0].trim(); // Tomar la primera parte antes de ':', si existe en el grupo
                const connections = nodeConnections[node.key] || {};
                const connectionStrings: string[] = [];

                Object.keys(connections).forEach(toNode => {
                    const texts = connections[toNode].join(', ');
                    connectionStrings.push(`${toNode}[${texts}]`);
                });

                const connectionsString = connectionStrings.join(', ');

                javaCode += `public class ${className} {\n`;
                javaCode += `    private String name = "${node.group.text}";\n`;
                javaCode += `    private List<String> connections = Arrays.asList(${connectionsString});\n\n`;
                javaCode += `    // Constructor\n`;
                javaCode += `    public ${className}() {\n`;
                javaCode += `        System.out.println("Creating ${className} object with connections: " + connections);\n`;
                javaCode += `    }\n\n\n`;
                javaCode += `    // Getter para name\n`;
                javaCode += `    public String getName() {\n`;
                javaCode += `        return this.name;\n`;
                javaCode += `    }\n\n`;
                javaCode += `    // Getter para connections\n`;
                javaCode += `    public List<String> getConnections() {\n`;
                javaCode += `        return this.connections;\n`;
                javaCode += `    }\n\n`;
                javaCode += `    // Setter para connections\n`;
                javaCode += `    public void setConnections(List<String> connections) {\n`;
                javaCode += `        this.connections = connections;\n`;
                javaCode += `    }\n}\n\n`;
            }

            // Obtener las conexiones para este nodo del mapa

        });

        return javaCode;
    }


}

