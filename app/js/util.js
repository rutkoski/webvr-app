
function extend(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                if (source[prop].constructor === Object) {
                    if (!obj[prop] || obj[prop].constructor === Object) {
                        obj[prop] = obj[prop] || {};
                        extend(obj[prop], source[prop]);
                    } else {
                        obj[prop] = source[prop];
                    }
                } else {
                    obj[prop] = source[prop];
                }
            }
        }
    });
    return obj;
}

function reticulumAddRecursive(obj3d, props) {
    Reticulum.add(obj3d, props);

    if (obj3d.children && obj3d.children.length) {
        var c = obj3d.children.length;
        for (var i = 0; i < c; i++) {
            reticulumAddRecursive(obj3d.children[i], props);
        }
    }
}

function groupObject(obj3d) {
    var group = new THREE.Object3D; 
    group.add(obj3d);
    return group;
}

function setShadowRecursive(obj3d, cast, receive) {
    obj3d.castShadow = cast;
    obj3d.receiveShadow = receive;

    if (obj3d.children && obj3d.children.length) {
        var c = obj3d.children.length;
        for (var i = 0; i < c; i++) {
            setShadowRecursive(obj3d.children[i], cast, receive);
        }
    }
}

function getItemAngle(itemLength, radius) {
    var _angle = THREE.Math.radToDeg(Math.atan((itemLength / 2) / radius) * 2);
    var maxColumns = Math.floor(360 / angle);
    angle = 360 / maxColumns;
    return angle;
}

function getItemAngleAndLength(gutter, maxColumns, radius) {
    var angle = (360 - (gutter * maxColumns)) / maxColumns;
    var length = getOpposite(angle, radius);//Math.tan(THREE.Math.degToRad(angle / 2)) * radius * 2;
    return { angle: angle, itemLength: length };
}

function getOpposite(angle, hypotenuse) {
    return Math.tan(THREE.Math.degToRad(angle / 2)) * hypotenuse * 2;
}