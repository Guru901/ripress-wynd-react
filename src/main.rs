use ripress::{app::App, types::RouterFns};
use wynd::wynd::{WithRipress, Wynd};

#[tokio::main]
async fn main() {
    let mut app = App::new();
    let mut wynd: Wynd<WithRipress> = Wynd::new();

    app.static_files("/", "./dist").unwrap();

    wynd.on_connection(|conn| async move {
        println!("Client connected: {:?}", conn.id());

        conn.on_text(|event, handle| async move {
            handle.send_text(&event.data).await.unwrap();
        });
    });

    app.get("/hello", |_, res| async {
        return res.text("Hello from Ripress!");
    });

    app.use_wynd("/ws", wynd.handler());

    app.listen(3000, || {
        println!("listening on http://localhost:3000");
    })
    .await
}
