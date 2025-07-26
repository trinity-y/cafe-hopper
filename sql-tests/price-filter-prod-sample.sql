SELECT * FROM "Cafe" 
WHERE LOWER(name) LIKE LOWER('%' || 'On' || '%') AND
(startPrice >= 10 
AND endPrice <= 20)
ORDER BY name;

SELECT * FROM "Cafe" 
WHERE (startPrice >= 10 
AND endPrice <= 20)
ORDER BY name;