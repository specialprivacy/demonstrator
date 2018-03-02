require 'json'

def timestamp
  Time.now.strftime('%H:%M:%S')
end

connections = []
notifications = []

get '/connect', provides: 'text/event-stream' do
  stream :keep_open do |out|
    connections << out
    # out.callback on stream close evt.
    out.callback do
      # delete the connection
      connections.delete(out)
    end
  end
end

post '/push' do
  log.info params
  # Add the timestamp to the notification
  notification = params.merge('timestamp' => timestamp).to_json

  notifications << notification

  notifications.shift if notifications.length > 10
  connections.each { |out| out << "data: #{notification}\n\n" }

  status 200
  body 'OK'
end
