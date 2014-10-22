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
    user = params[:user]
    slot = params[:slot]
    dices = params[:dices]
    result = {} 
    $players.each do |p|
      if p[:id].to_s == user
        logger.debug p.inspect
        p[:game][slot] = rules( slot, dices)  
        p[:turn] = 0
        result.merge( {"slot" => slot, "point" => p[:game][slot]})
      end
    end

    render json:result
  end

  def players
    render json:$players
  end

private 
  def rules (slot, dices)
    logger.debug "rules " + slot.to_s
    case slot
      when 0..5 #Aces ~ Sixes
        upper( slot,  dices)
      when 6..7 #3 of kinds, 4 of kinds
        akind( slot-3, dices)
      when 8 #Full house
        fullhouse dices
      when 9 #strait sm
        contain [[0,1,2,3],[1,2,3,4], [2,3,4,5]], dices, 30
      when 10 #strait Lg
        contain [[0,1,2,3,4],[1,2,3,4,5]], dices, 40
      when 11 #yahtzee
        50 if nkind( 5, dices )
      when 12 #chance
        total dices      
    end
  end

  def fullhouse dices
    count = [0, 0, 0, 0, 0, 0]
    count.each_with_index { |c, i| c = dices.count{|k,v| v == i }}
    logger.debug count.inspect
    if (count.include? 2 )&& (count.include? 3)
      return 40
    else
      return 0
    end
  end 
  #total counts of dices
  def total dices
    sum = 0
    dices.each { |d| sum += (d[:eye] + 1) }
    return sum  
  end

  #return count  
  def nkind (count, dices)
    logger.debug get_dice_eyes dices
    real_count = 0
    eye = 0
    [0..5].each { |i| real_count = dices.count{|k,v| v == i} if dices.count{|k,v| v == i} >= real_count }
    return count <= real_count
  end

  def akind (eye, dices)
    point = 0;
    if nkind( eye, dices)
      total dices
    end
    return point
  end

  def contain( set, dices, score)
    set.each { |s| return score if dices.include? s}
    return 0
  end

  def upper (eye,  dices)
    sum = 0
    dices.each { |d| sum += (d[:eye]+1) if d[:eye] == eye }
    return sum 
  end

  def get_dice_eyes dices
    eyes = [0, 0, 0, 0, 0]
    dices.each_with_index { |d, i| eyes[i] = d[:eye]}
    return eyes
  end
end