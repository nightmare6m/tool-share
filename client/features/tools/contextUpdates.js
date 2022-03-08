import {GET_MY_TOOLS, CREATE_TOOL, UPDATE_TOOL, DELETE_TOOL} from 'features/tools/queries';

export function UpdateToolCacheCreate (cache, {data}) {
    const myTools = cache.readQuery({
        query: GET_MY_TOOLS
      }).myTools;
      const newTool ={
        id: data.createTool.tool.id,
        description: data.createTool.tool.description,
        category: data.createTool.tool.category,
        quantity: data.createTool.tool.quantity
      }
      cache.writeQuery({
        query: GET_MY_TOOLS,
        data: {myTools: {
          tools: myTools.tools.concat([newTool]),
          errorCode: null,
          message: "" 
        }}
      });
}

export function UpdateToolCacheEdit (cache, {data}) {
    const myTools = cache.readQuery({
        query: GET_MY_TOOLS
      }).myTools.tools.slice();
      const newTool ={
        id: data.updateTool.tool.id,
        description: data.updateTool.tool.description,
        category: data.updateTool.tool.category,
        quantity: data.updateTool.tool.quantity
      }

      myTools.splice(myTools.indexOf(myTools.find(tool => tool.id === newTool.id)), 1, newTool);
      cache.writeQuery({
        query: GET_MY_TOOLS,
        data: {myTools: {
          tools: myTools,
          errorCode: null,
          message: "" 
        }}
      });
}

export function UpdateToolCacheDelete (cache, {data}) {
    const myTools = cache.readQuery({
        query: GET_MY_TOOLS
      }).myTools;
      cache.writeQuery({
        query: GET_MY_TOOLS,
        data: {myTools: {
          tools: myTools.tools.filter(tool => tool.id !== data.deleteTool.toolId),
          errorCode: null,
          message: "" 
        }}
      });
}