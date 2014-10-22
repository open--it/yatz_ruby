class YahtzeeController < ApplicationController
  skip_before_filter  :verify_authenticity_token

  layout false

  $players = Array.new
  $seq = 0

  def enroll
    $seq += 1
    $players.push( {
      id:$seq,
      game:[nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil],
      turn:0
    })
    
    render json:{"id" => ($seq -1) }
  end

  def user_roll
    user = params[:user]
    eyes = params[:_json]
    $players.each do |p|
      if p[:id].to_s == user && p[:turn] < 3
        eyes.each do |e| e[:eye] = rand(0..5) unless e[:status] == 'hold' end
        p[:turn] += 1
      end
    end

    render json:eyes
  end

  def user_decision
    render json: ""
  end

  def players
    render json:$players
  end

end
