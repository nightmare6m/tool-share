const Firestore = require('../firebase/firestore');
const { v4: uuidv4 } = require('uuid');

async function getMyTools (userId) {
    const myToolsDoc = await Firestore.getDocument(userId);
    return myToolsDoc?myToolsDoc.tools:[];
}
async function createTool(userId, description, category, quantity){
    const newTool = {
        id: uuidv4(),
        description: description,
        category: category,
        quantity: quantity
    }
    
    const myTools = await getMyTools(userId); 
    await Firestore.setDocument(userId, {tools:myTools.concat([newTool])});
    return newTool;
}
async function updateTool(userId, toolId, description, category, quantity){
    const myTools = await getMyTools(userId); 
    const newTool = myTools.find(tool => tool.id === toolId);
    newTool.description=description;
    newTool.category=category;
    newTool.quantity=quantity;

    await Firestore.setDocument(userId, {tools:myTools});
    return newTool;
}
async function deleteTool(userId, toolId){
    const myTools = await getMyTools(userId); 
    const newTool = myTools.find(tool => tool.id === toolId);
    myTools.splice(myTools.indexOf(newTool), 1);
    await Firestore.setDocument(userId, {tools:myTools});
}

module.exports = {
    getMyTools,
    createTool,
    updateTool,
    deleteTool
}