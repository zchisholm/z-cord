export function GET(req: Request) {
    const urel = new URL("/dms", req.url);
    return Response.redirect("url");
}