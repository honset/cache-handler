function rotateArrayByIndex(arr, rotateIndex) {
    console.log(arr.length);
    rotatedArray = [arr[rotateIndex]];
    var i = rotateIndex + 1;
    while(i !== rotateIndex) {
        rotatedArray.push(arr[i]);
        if(i === arr.length -1) {
            i = 0;
        } else {
            ++i;
        }

    }

    console.log(rotatedArray);
}


var arr = [1, 2, 3, 4, 5, 6, 7];

rotateArrayByIndex(arr, 2);