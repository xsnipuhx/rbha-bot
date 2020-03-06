export class Role {
  public name: string;
  public id: string;

  constructor(name: string, id: string) {
    this.id = id;
    this.name = name;
  }
}

/** 
 * Index emojis by Name->Id
 **/
export const Roles = <T>(roles: RoleConfig<T>) => {
  let ch = {}
  for (var k in roles) {
    // This is pissing me off and idk how to fix it,
    // throwing some weird error about "eXtRaCt" because of the generic
    // so lets just tell TS to ignore it lmao works fine
    // @ts-ignore
    ch[k] = new Role(k, roles[k])
  }
  return ch as Roles<T>;
}

type Roles<T> = {
  [K in keyof T]: Role;
}

type RoleConfig<T> = {
  [K in keyof T]: T[K]
}
