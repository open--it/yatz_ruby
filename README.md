Yahtzee
=======

Yahtzee 

For Korean.
==========

야찌는 다이스라는 주사위 게임을 기반으로 동작해진다. 
다이스는 주사위 5개를 3번까지 던질 수 있고, 던질 때마다 원하는 만큼의 주사위를 
안던지고 잡아둘 수 있다. 3번의 기회 안에서 가장 높은 점수를 획득하는 사람이 승리한다. 

야찌는 13번의 턴을 돌면서 1턴마다 다이스를 하며, 각 패에 맞는 점수를 기입하여, 
최종으로 가장 높은 점수를 획득하는 사람이 승리하는 게임이다. 


동작.
==========
클라이언트는 angularjs로 작성된 onepage app이며, 
각 턴을 돌때마다, ruby on rails로 작성된 서버와 통신하면서 점수 계산을 하고 최종적으로 
승리자를 뽑게 되는 것이다. 

간단한 시연을 목적으로 작성된 앱이기에, 사용자의 개념은 단순히 시퀀스로 구분하며,
기본 계산 규칙 외에 다른 보안, 성능, 재기동에 따른 이슈등은 거의 고려하지 않았다. 
