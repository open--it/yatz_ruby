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
    
    render json:$players
  end

  def user_roll
    user = params[:user]
    eyes = params[:_json]
    $players.each do |p|
      if p[:id].to_s == user && p[:turn] < 3
        eyes.each do |e| e[:eye] = rand(1..6) unless e[:status] == 'hold' end
        p[:turn] += 1
      end
    end

    render json:eyes
  end

  def user_decision
    user = params[:user]
    decision = params[:_json]
    result = {} 
    $players.each do |u|
      if p[:id].to_s == user
        p[:game][decision[:slot]] = rules decision[:slot] 
        p[:turn] = 0
        result.merge {"slot" => decision[:slot], "point" => p[:game][decision[:slot]]}
      end
    end

    render json:result
  end

  def players
    render json:$players
  end

private 
  def rules slot dices
    case slot
      when 0..6
        upper slot+1 dices
      when 6..7
        akind slot-3 dices
      when 8
      when 9
      when 10
      when 11
      when 12
        total dices      
    end
  end

  def total dices
    sum = 0
    dices.each do |d| sum += d end
    return sum  
  end

  def nkind eye dices
    sum = 0
    dices.each { |d| sum += d if e == eye }
    return sum
  end

  def akind eye dices
  end

  def contain
  end

  def upper eye dices
    sum = 0
    dices.each { |e| sum += e if e == eye }
    return sum 
  end
end