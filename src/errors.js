/**
 * Para criar novos tipos de erro, adicione o nome desejado
 * e seu status HTTP correspondente em `errorNameToHttpStatusCode`,
 * seguindo os exemplos.
 *
 * Ao usar a função `createError`, o VSCode vai incluir
 * seu novo nome na lista de sugestões automáticas
 */

const errorNameToHttpStatusCode = {
  NotFoundError: 404,
  UnauthorizedError: 401,
  InternalServerError: 500,
  InvalidInputError: 400,
  ForbiddenError: 403,
};

/**
 *
 * @typedef {keyof typeof errorNameToHttpStatusCode} ErrorNames
 */

/**
 * @param {ErrorNames} name
 * @param {string} message
 */
function createError(name, message) {
  return { name, message };
}

module.exports = {
  createError,
  errorNameToHttpStatusCode,
};
