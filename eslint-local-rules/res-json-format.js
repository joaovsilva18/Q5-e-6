// @ts-nocheck
module.exports = {
  "res-json-format": {
    create(context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === "MemberExpression" &&
            node.callee.property.name === "json" &&
            (node.callee.object.name === "res" ||
              node.callee.object.name?.toLowerCase()?.includes("response"))
          ) {
            const args = node.arguments[0];
            if (
              !args ||
              args.type !== "ObjectExpression" ||
              !args.properties.some(
                (prop) => prop.key && prop.key.name === "err"
              ) ||
              !args.properties.some(
                (prop) => prop.key && prop.key.name === "data"
              )
            ) {
              context.report({
                node,
                message:
                  "json() must have {error: any, data: any} as argument.",
              });
            }
          }
        },
      };
    },
  },
};
