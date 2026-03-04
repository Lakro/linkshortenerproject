---
name: create-copilot-instructions
description: Copilot Instructions Generator for official instructions files in the .github/instructions directory.
agent: instructions-generator
---
Take the information below and generate an agent instructions [NAME].instructions.md file for it in the .github/instructions directory. Generate an appropriate filename for the [NAME] placholder based on the content. Make sure the instructions are concise and not too long. If no information is provided below, prompt the user to give the necessary details about the layer of architecture or coding standards to document.

The .md file should have frontmatter with a description property that informs copilot of when to use this set of Instructions.