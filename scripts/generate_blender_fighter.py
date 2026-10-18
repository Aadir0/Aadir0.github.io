import bpy
import os
import math

def create_lowpoly_fighter(output_blend, output_glb):
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_blend), exist_ok=True)

    # Reset Blender scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # Create collection
    collection = bpy.data.collections.new("FighterCollection")
    bpy.context.scene.collection.children.link(collection)

    # Materials
    def make_mat(name, color, roughness=0.5, metalness=0.1):
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        if bsdf:
            # Color is RGBA
            bsdf.inputs['Base Color'].default_value = (*color, 1.0)
            bsdf.inputs['Roughness'].default_value = roughness
            bsdf.inputs['Metallic'].default_value = metalness
        return mat

    skin_mat = make_mat("SkinMat", (0.85, 0.65, 0.45), roughness=0.6)
    trunks_mat = make_mat("TrunksMat", (0.72, 0.31, 0.05), roughness=0.4)
    glove_mat = make_mat("GloveMat", (0.86, 0.15, 0.15), roughness=0.25, metalness=0.2)
    dark_mat = make_mat("DarkMat", (0.1, 0.1, 0.12), roughness=0.7)

    def add_mesh_obj(name, primitive_func, location, scale, material):
        primitive_func()
        obj = bpy.context.active_object
        obj.name = name
        obj.location = location
        obj.scale = scale
        if material:
            obj.data.materials.append(material)
        return obj

    # Torso (Chest)
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    chest = bpy.context.active_object
    chest.name = "Chest"
    chest.location = (0, 0, 1.95)
    chest.scale = (0.5, 0.3, 0.45)
    chest.data.materials.append(skin_mat)

    # Abdomen
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    abs_obj = bpy.context.active_object
    abs_obj.name = "Abdomen"
    abs_obj.location = (0, 0, 1.55)
    abs_obj.scale = (0.42, 0.26, 0.35)
    abs_obj.data.materials.append(skin_mat)

    # Belt / Waistband
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    belt = bpy.context.active_object
    belt.name = "Belt"
    belt.location = (0, 0, 1.35)
    belt.scale = (0.44, 0.28, 0.1)
    belt.data.materials.append(dark_mat)

    # Boxing Shorts
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    shorts = bpy.context.active_object
    shorts.name = "Shorts"
    shorts.location = (0, 0, 1.15)
    shorts.scale = (0.45, 0.28, 0.3)
    shorts.data.materials.append(trunks_mat)

    # Head
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=10, radius=0.32)
    head = bpy.context.active_object
    head.name = "Head"
    head.location = (0, 0, 2.5)
    head.data.materials.append(skin_mat)

    # Headband
    bpy.ops.mesh.primitive_cube_add(size=1.0)
    headband = bpy.context.active_object
    headband.name = "Headband"
    headband.location = (0, 0, 2.65)
    headband.scale = (0.35, 0.35, 0.1)
    headband.data.materials.append(trunks_mat)

    # Right Arm & Glove
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.12, depth=0.6)
    arm_r = bpy.context.active_object
    arm_r.name = "Arm_R"
    arm_r.location = (0.6, 0, 1.85)
    arm_r.data.materials.append(skin_mat)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=10, radius=0.26)
    glove_r = bpy.context.active_object
    glove_r.name = "Glove_R"
    glove_r.location = (0.6, 0.25, 1.5)
    glove_r.scale = (1.0, 1.25, 1.1)
    glove_r.data.materials.append(glove_mat)

    # Left Arm & Glove
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.12, depth=0.6)
    arm_l = bpy.context.active_object
    arm_l.name = "Arm_L"
    arm_l.location = (-0.6, 0, 1.85)
    arm_l.data.materials.append(skin_mat)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=10, radius=0.26)
    glove_l = bpy.context.active_object
    glove_l.name = "Glove_L"
    glove_l.location = (-0.6, 0.25, 1.5)
    glove_l.scale = (1.0, 1.25, 1.1)
    glove_l.data.materials.append(glove_mat)

    # Right Leg & Boot
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.14, depth=0.8)
    leg_r = bpy.context.active_object
    leg_r.name = "Leg_R"
    leg_r.location = (0.24, 0, 0.65)
    leg_r.data.materials.append(skin_mat)

    bpy.ops.mesh.primitive_cube_add(size=1.0)
    boot_r = bpy.context.active_object
    boot_r.name = "Boot_R"
    boot_r.location = (0.24, 0.06, 0.15)
    boot_r.scale = (0.16, 0.26, 0.18)
    boot_r.data.materials.append(dark_mat)

    # Left Leg & Boot
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.14, depth=0.8)
    leg_l = bpy.context.active_object
    leg_l.name = "Leg_L"
    leg_l.location = (-0.24, 0, 0.65)
    leg_l.data.materials.append(skin_mat)

    bpy.ops.mesh.primitive_cube_add(size=1.0)
    boot_l = bpy.context.active_object
    boot_l.name = "Boot_L"
    boot_l.location = (-0.24, 0.06, 0.15)
    boot_l.scale = (0.16, 0.26, 0.18)
    boot_l.data.materials.append(dark_mat)

    # Save .blend file
    bpy.ops.wm.save_as_mainfile(filepath=output_blend)
    print(f"Saved Blender project to {output_blend}")

    # Export .glb
    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        use_selection=False,
        export_apply=True
    )
    print(f"Exported GLB asset to {output_glb}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, 'assets', 'models')
    blend_path = os.path.join(models_dir, 'fighter.blend')
    glb_path = os.path.join(models_dir, 'fighter.glb')
    create_lowpoly_fighter(blend_path, glb_path)
