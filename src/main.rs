use ripress::{app::App, types::RouterFns};

#[tokio::main]
async fn main() {
    let mut app = App::new();

    app.static_files("/", "./dist").unwrap();

    app.get("/hello", |_, res| async {
        return res.text("Hello from Ripress!");
    });

    app.listen(3000, || {
        println!("listening on http://localhost:3000");
    })
    .await
}
