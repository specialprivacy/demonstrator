defmodule Dispatcher do
  use Plug.Router

  def start(_argv) do
    port = 80
    IO.puts "Starting Plug with Cowboy on port #{port}"
    Plug.Adapters.Cowboy.http __MODULE__, [], port: port
    :timer.sleep(:infinity)
  end

  plug Plug.Logger
  plug :match
  plug :dispatch

  match "/push-tester/*path" do
    Proxy.forward conn, path, "http://push-tester/"
  end

  match "/*path" do
		  conn
      |> put_resp_content_type("text/plain")
      |> send_resp(404, "not found")
	end

end
