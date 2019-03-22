function generateCommands({ stock, tool }) {
    const setupInstructions = {
        'Face / Plane' : `(SETUP INSTRUCTIONS)
                          (Zero tool on near left corner)
                          (Job runs in X+/Y+ direction from home)
                          (Tool will overlap surface by ${tool.diameter / 2}")`,
        'Edge / Joint' : `(SETUP INSTRUCTIONS)
                          (Zero tool on near left corner)
                          (If tool is larger than amount to remove, offset)
                          (tool so first pass will remove desired amount)`,
    };
    let passes = 1;
    let depths = 1;
    let maxDepth = 0;

    if (stock.operation === 'Face / Plane') {
        // Ensure the entire width is milled with tool radius overlap
        const width = stock.width + (tool.diameter / 2);
        passes = Math.ceil(width / tool.stepover);
        depths = Math.ceil(stock.remove / tool.doc);
        maxDepth = stock.remove;
    } else {
        passes = Math.ceil(stock.remove / tool.stepover);
        depths = Math.ceil(stock.thickness / tool.doc);
        maxDepth = stock.thickness;
    }

    // Job start commands
    const commands = [
        `M03 S${tool.rpm} (Start spindle @ ${tool.rpm}rpm)`,
        'G00 X0 Y0 Z0.5 (Rapid to work offset)',
        '(Begin milling)',
    ];

    // Create a set of commands for each axial pass
    for (let i = 1; i <= depths; i += 1) {
        const doc = i === depths ? maxDepth : Math.round(tool.doc * i * 1000) / 1000;

        commands.push(`(Pass No. ${i} @ ${doc * -1}")`, `G01 Z${doc * -1} F${tool.ipm / 4}`);

        // Create a set of commands for each radial pass
        for (let j = 0; j < passes; j += 1) {
            commands.push(`G01 X${Math.round(tool.stepover * j * 1000) / 1000} F${tool.ipm}`);
            commands.push(`G01 Y${j % 2 ? 0 : stock.length} F${tool.ipm}`);
        }

        commands.push('G00 Z0.5  (Retract tool)');
        commands.push('G00 X0 Y0 (Rapid home)');
    }

    // Job end commands
    commands.push('M05 (Stop spindle)', 'M02 (Job complete)');

    // Credits
    commands.unshift(
      '(------------------------------------------------)',
      '(  CNC MILLING GENERATOR                         )',
      '(  Author: Derek Wheelden                        )',
      '(  Source: https://millinggcode.glitch.me/       )',
      '(------------------------------------------------)',
      `(Operation: ${stock.operation})`,
      `${setupInstructions[stock.operation]}`,
      `(Generated ${commands.length} lines of code)`,
    );

    return commands;
}

// Get value from input and convert to number if possible
function parseValue(value) {
    return Number.isNaN(Number(value)) ? value : Number(value);
}

// Get all of the input values from the form
function getSetup(values) {
    return {
        stock : {
            width : parseValue(values.StockWidth),
            length : parseValue(values.StockLength),
            thickness : parseValue(values.StockThickness),
            remove : parseValue(values.StockRemove),
            operation : parseValue(values.StockOperation),
        },
        tool : {
            diameter : parseValue(values.ToolDiameter),
            stepover : parseValue(values.ToolStepover),
            rpm : parseValue(values.ToolRpm),
            ipm : parseValue(values.ToolIpm),
            doc : parseValue(values.ToolDoc),
        },
    };
}

export default function (values) {
    return generateCommands(getSetup(values));
}
