export function duplicatedProjectError() {
  return {
    name: "DuplicatedProjectError",
    message: "There is already a project with given name",
  };
}

export function forbiddenError() {
  return {
    name: "ForbiddenError",
    message: "You are not the owner",
  };
}

export function imageNotFoundError() {
  return {
    name: "ImageNotFoundError",
    message: "There is no image with given id",
  };
}

export function invalidCredentialsError() {
  return {
    name: "InvalidCredentialsError",
    message: "E-mail or password are incorrect",
  };
}

export function moodboardNotFoundError() {
  return {
    name: "MoodboardNotFoundError",
    message: "There is no moodboard with given id",
  };
}

export function projectNotFoundError() {
  return {
    name: "ProjectNotFoundError",
    message: "There is no project with given id",
  };
}

export function unauthorizedError() {
  return {
    name: "UnauthorizedError",
    message: "You must be signed in to continue",
  };
}
