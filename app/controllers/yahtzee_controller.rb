class YahtzeeController < ApplicationController
  skip_before_filter  :verify_authenticity_token

  layout false

  $players = Array.new
  $seq = 0

  def enroll
    render json:""
  end

  def user_roll
    render json:""
  end

  def user_decision
    render json:""
  end

  def players
    render json:""
  end
end
