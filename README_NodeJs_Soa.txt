nodeJs peut facilement appeler des WS SOAP via 'npm i -s soap'
--> pratique pour médiation de service REST<-->SOAP

nodeJs peut communiquer avec des MOM (ex: ActiveMq, Artemis, ...)
via rhea 
--> pratique pour envoyer/recevoir des messages dans queue/topic
    avec possibilité simple pour communiquer avec appli java/jms

quasiment aucune api nodeJs au point pour executer du bpmn
bpmn-engine est assez limité et "propriétaire/specifique camunda"
==> vaut mieux ne pas utiliser nodeJs avec bpmn (pour l'instant)
    utiliser si besoin des solutions basées sur java (Flowable,Jbpm, activiti)
    pas gênant car bpmn est un marché de niche !