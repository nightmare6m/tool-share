var assert = require('assert');
var sinon = require('sinon');
const Firestore = require('../../firebase/firestore');
const {resolvers} = require('../../resolvers');

describe('Test get my tools', function() {
    afterEach(function () {
      sinon.restore();
    });

    it('should return a 401 error with no logged in user', async function() {
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return [];
      });

      const results = await resolvers.Query.myTools({}, {}, {});
      assert.equal(results.errorCode, 401);
    });
    it('should return tools when there is a logged in user', async function() {
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return {
          tools: []
        };
      });

      const results = await resolvers.Query.myTools({}, {}, {currentUser: {user_id:"123"}});
      assert.equal(results.errorCode, null);
      assert.equal(results.tools.length, 0);
    });
  });

  describe('Test create tool', function() {
    afterEach(function () {
      sinon.restore();
    });

    it('should return a 401 error with no logged in user', async function() {
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return {
          tools: []
        };
      });
      sinon.stub(Firestore, 'setDocument').callsFake(function(){
        return {};
      });

      const results = await resolvers.Mutation.createTool({}, {}, {});
      assert.equal(results.errorCode, 401);
    });
    it('should create a tool when there is a logged in user', async function() {
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return {
          tools: []
        };
      });
      sinon.stub(Firestore, 'setDocument').callsFake(function(){
        return {};
      });
      const toolDescription = "new tool description";
      const results = await resolvers.Mutation.createTool({}, {input: {description: toolDescription, category: "123", quantity: 1}}, {currentUser: {user_id:"123"}});
      assert.equal(results.tool.description, toolDescription);
      assert.equal(results.errorCode, null);
      assert.ok(results.tool.id);
    });
  });


  describe('Test update tool', function() {
    afterEach(function () {
      sinon.restore();
    });

    it('should return a 401 error with no logged in user', async function() {
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return {
          tools: []
        };
      });
      sinon.stub(Firestore, 'setDocument').callsFake(function(){
        return {};
      });

      const results = await resolvers.Mutation.updateTool({}, {}, {});
      assert.equal(results.errorCode, 401);
    });
    it('should update a tool when there is a logged in user', async function() {
      const oldTool = {
        id: "123",
        description: "old description",
        category: "1",
        quantity: 1
      };
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return {
          tools: [
            oldTool
          ]
        };
      });
      sinon.stub(Firestore, 'setDocument').callsFake(function(){
        return {};
      });
      const updatedTool = {
        id: "123",
        description: "updated description",
        category: "1",
        quantity: 1
      };
      const results = await resolvers.Mutation.updateTool({}, {input: updatedTool}, {currentUser: {user_id:"123"}});
      assert.equal(results.tool.description, updatedTool.description);
      assert.equal(results.errorCode, null);
      assert.equal(updatedTool.id, oldTool.id);
    });
  });



  describe('Test delete tool', function() {
    afterEach(function () {
      sinon.restore();
    });

    it('should return a 401 error with no logged in user', async function() {
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return {
          tools: []
        };
      });
      sinon.stub(Firestore, 'setDocument').callsFake(function(){
        return {};
      });

      const results = await resolvers.Mutation.deleteTool({}, {}, {});
      assert.equal(results.errorCode, 401);
    });
    it('should delete a tool when there is a logged in user', async function() {
      const oldTool = {
        id: "123",
        description: "old description",
        category: "1",
        quantity: 1
      };
      sinon.stub(Firestore, 'getDocument').callsFake(function(){
        return {
          tools: [
            oldTool
          ]
        };
      });
      sinon.stub(Firestore, 'setDocument').callsFake(function(){
        return {};
      });
  
      const results = await resolvers.Mutation.deleteTool({}, {id: "123"}, {currentUser: {user_id:"123"}});
      assert.equal(results.errorCode, null);
    });
  });