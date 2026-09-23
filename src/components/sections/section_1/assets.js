export function asset(url){
  return typeof url==='string' && url.startsWith('/assets/')
    ? import.meta.env.BASE_URL + url.slice(1) : url;
}
export function resolveAssets(value){
  if(Array.isArray(value))return value.map(resolveAssets);
  if(value && typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,resolveAssets(item)]));
  return asset(value);
}
