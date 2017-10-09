export class Asset {
    ns: string
    type: string
    link: string
    createdBy: string
}

export class ChildAsset extends Asset {
    parent: string
}

export class PolicyAsset extends ChildAsset {
    policy: [any]
}
