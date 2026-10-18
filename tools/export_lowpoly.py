"""
Low-poly prop exporter for the boxing arena (Aaditya Raj portfolio game).

Run with Blender headless:
    blender -b -P tools/export_lowpoly.py

Exposes simple props built from bmesh primitives and writes them as
vertices + faces to assets/lowpoly_models.json. The game converts these
into THREE.BufferGeometry at runtime (no loader addon required).

Parts are exported separately so the game can color each part:
  stool      -> [seat, leg]
  crowdfolk  -> [body, head]
  belt       -> [strap, plate]
  presscam   -> [body, lens]
"""

import bpy
import bmesh
import json
import math
import os
from mathutils import Matrix, Vector, Euler

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.abspath(os.path.join(HERE, "..", "assets"))
OUT = os.path.join(OUT_DIR, "lowpoly_models.json")

X, Y, Z = 0, 1, 2


def M(loc=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)):
    """Local transform matrix."""
    return Matrix.LocRotScale(
        Vector(loc), Euler((rot[0], rot[1], rot[2]), "XYZ"), Vector(scale)
    )


def add_cone(bm, seg, r1, r2, depth, matrix):
    bmesh.ops.create_cone(
        bm, cap_ends=True, segments=seg, radius1=r1, radius2=r2,
        depth=depth, matrix=matrix
    )


def add_cube(bm, size, matrix):
    bmesh.ops.create_cube(bm, size=size, matrix=matrix)


def add_sphere(bm, radius, matrix):
    bmesh.ops.create_uvsphere(
        bm, u_segments=8, v_segments=6, radius=radius, matrix=matrix
    )


def build_stool():
    """Corner boxing stool: round seat + three splayed legs."""
    bm = bmesh.new()
    # Seat
    add_cone(bm, 10, 0.42, 0.38, 0.09, M(loc=(0, 0, 0.62)))
    # Legs (three, tilted outward for stability look)
    for i in range(3):
        ang = math.radians(120 * i)
        add_cone(
            bm, 6, 0.035, 0.035, 0.62,
            M(
                loc=(math.cos(ang) * 0.22, math.sin(ang) * 0.22, 0.29),
                rot=(math.sin(ang) * 0.28, -math.cos(ang) * 0.28, 0),
            )
        )
    return bm


def build_crowdfolk():
    """Spectator: cone torso + sphere head (one merged low-poly fan)."""
    bm = bmesh.new()
    add_cone(bm, 7, 0.24, 0.15, 0.62, M(loc=(0, 0, 0.32)))
    add_sphere(bm, 0.16, M(loc=(0, 0.02, 0.76)))
    return bm


def build_belt():
    """Championship belt (designed in Blender space, converted to Y-up in game):
       wide center plate + two straps angling up to the hang point."""
    bm = bmesh.new()
    # Center plate (wide in X, tall in Blender Z -> tall in game Y, thin in game Z)
    add_cube(bm, 1, M(scale=(0.46, 0.055, 0.30)))
    # Straps: elongated along Blender Z, leaning outward
    add_cube(bm, 1, M(loc=(0.40, 0.06, 0.42), rot=(0.55, 0, 0), scale=(0.16, 0.10, 0.55)))
    add_cube(bm, 1, M(loc=(-0.40, 0.06, 0.42), rot=(-0.55, 0, 0), scale=(0.16, 0.10, 0.55)))
    # Small centered gem protruding toward the camera
    add_cube(bm, 1, M(loc=(0, -0.045, 0.12), scale=(0.16, 0.05, 0.16)))
    return bm


# --- Character body parts (assembled as a rig hierarchy inside the game) ---

def build_char_torso():
    """Muscular low-poly torso: broad chest tapering to a narrow waist."""
    bm = bmesh.new()
    add_cone(bm, 6, 0.26, 0.40, 0.55, M(loc=(0, 0, 0.18)))    # chest
    add_cone(bm, 6, 0.34, 0.26, 0.32, M(loc=(0, 0, -0.28)))   # waist
    return bm


def build_char_shorts():
    """Boxing trunks: hip block + waistband."""
    bm = bmesh.new()
    add_cone(bm, 6, 0.36, 0.34, 0.48, M(loc=(0, 0, 0)))       # trunks
    add_cone(bm, 6, 0.37, 0.37, 0.10, M(loc=(0, 0, 0.28)))    # belt band
    return bm


def build_char_head():
    """Head with a short neck."""
    bm = bmesh.new()
    add_sphere(bm, 0.32, M(loc=(0, 0, 0.16)))
    add_cone(bm, 6, 0.11, 0.13, 0.18, M(loc=(0, 0, -0.18)))
    return bm


def build_char_gear():
    """Headgear cap."""
    bm = bmesh.new()
    add_cube(bm, 1, M(loc=(0, 0, 0.05), scale=(0.62, 0.55, 0.34)))
    return bm


def build_char_arm():
    """Upper arm segment (shoulder to glove zone)."""
    bm = bmesh.new()
    add_cone(bm, 6, 0.13, 0.155, 0.66, M(loc=(0, 0, -0.05)))
    return bm


def build_char_glove():
    """Boxing glove, slightly egg-shaped."""
    bm = bmesh.new()
    add_sphere(bm, 0.20, M(scale=(1.0, 1.3, 1.15)))
    return bm


def build_char_leg():
    """Leg segment, thicker at the thigh."""
    bm = bmesh.new()
    add_cone(bm, 6, 0.15, 0.115, 0.80, M(loc=(0, 0, -0.02)))
    return bm


def build_char_boot():
    """Boxing boot with a toe cap."""
    bm = bmesh.new()
    add_cube(bm, 1, M(loc=(0, 0, -0.02), scale=(0.27, 0.40, 0.34)))
    add_cube(bm, 1, M(loc=(0, 0.18, -0.10), scale=(0.25, 0.24, 0.20)))
    return bm


def main():
    props = {
        "stool": "build_stool",
        "crowdfolk": "build_crowdfolk",
        "belt": "build_belt",
        "presscam": "build_presscam",
        "char_torso": "build_char_torso",
        "char_shorts": "build_char_shorts",
        "char_head": "build_char_head",
        "char_gear": "build_char_gear",
        "char_arm": "build_char_arm",
        "char_glove": "build_char_glove",
        "char_leg": "build_char_leg",
        "char_boot": "build_char_boot",
    }

    data = {}
    for name, fn in props.items():
        bm = globals()[fn]()
        parts = []
        for _ in range(1):  # single merged part per prop (already combined)
            parts.append(export_part(bm))
        data[name] = parts
        print("exported", name, "-", len(parts[0]["verts"]), "verts")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"version": 1, "props": data}, f)
    print("wrote", OUT)


main()
